using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string TargetUsername { get; set; }
        }
        
        public class Handler: IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _dataContext;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext dataContext, IUserAccessor userAccessor)
            {
                _dataContext = dataContext;
                _userAccessor = userAccessor;
            }
            
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var observer =
                    await _dataContext.Users
                        .FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUserName());

                var target = await _dataContext.Users.FirstOrDefaultAsync(u => u.UserName == request.TargetUsername);
                if (target is null) return null;

                var following = await _dataContext.UserFollowings
                    .FindAsync(observer.Id, target.Id);
                if (following is null)
                {
                    following = new UserFollowing
                    {
                        Observer = observer,
                        Target = target
                    };

                    _dataContext.UserFollowings.Add(following);
                }
                else
                {
                    _dataContext.UserFollowings.Remove(following);
                }

                var success = await _dataContext.SaveChangesAsync(cancellationToken) > 0;
                if (success) return Result<Unit>.Success(Unit.Value);
                return Result<Unit>.Failure("Failed to update following");
            }
        }
    }
}